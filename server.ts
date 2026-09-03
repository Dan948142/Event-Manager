import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_EVENTS } from './src/data/initialData';
import { JainEventItem, Guest } from './src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'events.json');

// In-memory events store with disk persistence
let events: JainEventItem[] = [];

function loadEvents() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Verify parsed items match array
      if (Array.isArray(parsed)) {
        events = parsed;
      } else {
        events = [...INITIAL_EVENTS];
        saveEvents();
      }
    } else {
      events = [...INITIAL_EVENTS];
      saveEvents();
    }
  } catch (err) {
    console.error('Error loading events:', err);
    events = [...INITIAL_EVENTS];
  }
}

function saveEvents() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving events to disk:', err);
  }
}

loadEvents();

// SSE Connected clients: Map of eventId -> Set of Express Response objects
const eventSubscribers = new Map<string, Set<express.Response>>();
const globalSubscribers = new Set<express.Response>();

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

function isPastFiveDays(dateTimeStr: string): boolean {
  try {
    const t = new Date(dateTimeStr).getTime();
    if (isNaN(t)) return false;
    return Date.now() - t > FIVE_DAYS_MS;
  } catch {
    return false;
  }
}

function sanitizeEventForPublic(event: JainEventItem): Omit<JainEventItem, 'organizerKey'> & { isArchived: boolean } {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { organizerKey, ...safeEvent } = event;
  return {
    ...safeEvent,
    isArchived: isPastFiveDays(event.dateTime),
  };
}

function broadcastEventUpdate(event: JainEventItem) {
  const safeData = JSON.stringify({
    type: 'EVENT_UPDATED',
    event: sanitizeEventForPublic(event),
  });

  const clients = eventSubscribers.get(event.id);
  if (clients) {
    for (const res of clients) {
      try {
        res.write(`data: ${safeData}\n\n`);
      } catch (err) {
        console.error('Error writing to client:', err);
      }
    }
  }

  // Also broadcast to global event list subscribers
  const globalData = JSON.stringify({
    type: 'EVENT_LIST_UPDATED',
    eventId: event.id,
    eventTitle: event.title,
    guestCount: event.guests.length,
  });
  for (const res of globalSubscribers) {
    try {
      res.write(`data: ${globalData}\n\n`);
    } catch {
      // Ignored
    }
  }
}

function broadcastEventDeleted(eventId: string) {
  const data = JSON.stringify({ type: 'EVENT_DELETED', eventId });
  const clients = eventSubscribers.get(eventId);
  if (clients) {
    for (const res of clients) {
      try {
        res.write(`data: ${data}\n\n`);
      } catch {
        // Ignored
      }
    }
  }
  for (const res of globalSubscribers) {
    try {
      res.write(`data: ${data}\n\n`);
    } catch {
      // Ignored
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // SSE Heartbeat to prevent timeouts
  setInterval(() => {
    const ping = `: ping\n\n`;
    for (const [, clients] of eventSubscribers) {
      for (const res of clients) {
        try {
          res.write(ping);
        } catch {
          // Ignored
        }
      }
    }
    for (const res of globalSubscribers) {
      try {
        res.write(ping);
      } catch {
        // Ignored
      }
    }
  }, 15000);

  // --- REST API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Organizer Email Login
  app.post('/api/organizer/login', (req, res) => {
    const { email, name, passcode } = req.body;
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || cleanEmail.split('@')[0]).trim();
    const token = `orgtok-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

    res.json({
      success: true,
      organizer: {
        email: cleanEmail,
        name: cleanName,
        token,
        loggedInAt: new Date().toISOString(),
      },
    });
  });

  // Get all events (Safe public view)
  app.get('/api/events', (req, res) => {
    const safeEvents = events.map(sanitizeEventForPublic);
    res.json(safeEvents);
  });

  // Create new event — ORGANIZER ONLY (Requires logged-in organizer email)
  app.post('/api/events', (req, res) => {
    const {
      title,
      eventType,
      templeName,
      location,
      dateTime,
      description,
      guidelines,
      organizerName,
      organizerPhone,
      organizerEmail,
    } = req.body;

    const authEmail = (organizerEmail || req.headers['x-organizer-email'] || '').toString().trim().toLowerCase();

    // Enforce organizer authentication requirement
    if (!authEmail || !authEmail.includes('@')) {
      return res.status(401).json({
        error: 'Organizer login required: You must be logged in with your verified email address to post new events.',
      });
    }

    if (!title || !dateTime || !organizerName || !templeName) {
      return res.status(400).json({
        error: 'Event Title, Temple/Venue Name, Date & Time, and Organizer Name are required.',
      });
    }

    const organizerKey = `org-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const hostGuestId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newEvent: JainEventItem = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      eventType: eventType || 'Temple Darshan',
      templeName: templeName.trim(),
      location: (location || 'Temple Grounds').trim(),
      dateTime,
      description: (description || '').trim(),
      guidelines: (guidelines || '').trim(),
      organizerName: organizerName.trim(),
      organizerPhone: (organizerPhone || '').trim(),
      organizerEmail: authEmail,
      organizerKey,
      guests: [
        {
          id: hostGuestId,
          name: `${organizerName.trim()} (Organizer)`,
          phone: (organizerPhone || '').trim(),
          hallOfResidence: 'Organizer Desk',
          joinedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    events.unshift(newEvent);
    saveEvents();
    broadcastEventUpdate(newEvent);

    res.status(201).json({
      event: sanitizeEventForPublic(newEvent),
      organizerKey,
      hostGuestId,
    });
  });

  // Get single event
  app.get('/api/events/:id', (req, res) => {
    const event = events.find((e) => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if client provided organizer key in header or query
    const key = (req.headers['x-organizer-key'] as string) || (req.query.key as string);
    const isOrganizer = !!key && key === event.organizerKey;

    res.json({
      ...sanitizeEventForPublic(event),
      isOrganizer,
    });
  });

  // Verify Organizer key
  app.post('/api/events/:id/verify-organizer', (req, res) => {
    const event = events.find((e) => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const { organizerKey, email } = req.body;
    const isValidKey = organizerKey && event.organizerKey === organizerKey.trim();
    const isValidEmail = email && event.organizerEmail && event.organizerEmail.toLowerCase() === email.toLowerCase();

    if (isValidKey || isValidEmail) {
      return res.json({ valid: true, organizerKey: event.organizerKey });
    }
    return res.status(403).json({ valid: false, error: 'Invalid organizer credentials' });
  });

  // Update Event Details — ORGANIZER ONLY
  app.put('/api/events/:id', (req, res) => {
    const event = events.find((e) => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const key = (req.headers['x-organizer-key'] as string) || req.body.organizerKey;
    if (!key || key !== event.organizerKey) {
      return res.status(403).json({
        error: 'Permission Denied: Only the verified organizer can modify event details or timings.',
      });
    }

    const {
      title,
      eventType,
      templeName,
      location,
      dateTime,
      description,
      guidelines,
      organizerPhone,
    } = req.body;

    if (title) event.title = title.trim();
    if (eventType) event.eventType = eventType;
    if (templeName) event.templeName = templeName.trim();
    if (location) event.location = location.trim();
    if (dateTime) event.dateTime = dateTime;
    if (description !== undefined) event.description = description.trim();
    if (guidelines !== undefined) event.guidelines = guidelines.trim();
    if (organizerPhone) event.organizerPhone = organizerPhone.trim();

    event.updatedAt = new Date().toISOString();
    saveEvents();
    broadcastEventUpdate(event);

    res.json({ success: true, event: sanitizeEventForPublic(event) });
  });

  // Real-time SSE stream for a specific event
  app.get('/api/events/:id/stream', (req, res) => {
    const eventId = req.params.id;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    if (!eventSubscribers.has(eventId)) {
      eventSubscribers.set(eventId, new Set());
    }
    eventSubscribers.get(eventId)!.add(res);

    // Send initial snapshot
    const event = events.find((e) => e.id === eventId);
    if (event) {
      res.write(`data: ${JSON.stringify({ type: 'EVENT_SNAPSHOT', event: sanitizeEventForPublic(event) })}\n\n`);
    }

    req.on('close', () => {
      const clients = eventSubscribers.get(eventId);
      if (clients) {
        clients.delete(res);
        if (clients.size === 0) {
          eventSubscribers.delete(eventId);
        }
      }
    });
  });

  // Join Event (Devotee Registration: Name, Phone, Hall of Residence)
  app.post('/api/events/:id/join', (req, res) => {
    const event = events.find((e) => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const { name, phone, hallOfResidence, guestId, notes } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }

    const cleanName = name.trim();
    const cleanPhone = (phone || '').trim().replace(/[\s-]/g, '');
    const cleanHall = (hallOfResidence || 'Campus / Sangha').trim();

    // Mobile number is strictly mandatory for guest participation
    if (!cleanPhone || cleanPhone.length < 10) {
      return res.status(400).json({
        error: 'WhatsApp / Mobile Number is mandatory for Sangha coordination. Please provide a valid 10-digit phone number.',
      });
    }

    // Check if guest is already registered by ID or by matching phone/name
    let existingGuest = event.guests.find(
      (g) => (guestId && g.id === guestId) || (cleanPhone && g.phone && g.phone === cleanPhone)
    );

    if (existingGuest) {
      // Update details
      existingGuest.name = cleanName;
      existingGuest.phone = cleanPhone;
      existingGuest.hallOfResidence = cleanHall;
      if (notes !== undefined) existingGuest.notes = notes;
    } else {
      const newGuest: Guest = {
        id: guestId || `guest-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: cleanName,
        phone: cleanPhone,
        hallOfResidence: cleanHall,
        joinedAt: new Date().toISOString(),
        notes: notes ? notes.trim() : undefined,
      };
      event.guests.push(newGuest);
      existingGuest = newGuest;
    }

    event.updatedAt = new Date().toISOString();
    saveEvents();
    broadcastEventUpdate(event);

    res.json({
      success: true,
      guest: existingGuest,
      event: sanitizeEventForPublic(event),
    });
  });

  // Guest cancels their presence / leave event
  app.post('/api/events/:id/leave', (req, res) => {
    const event = events.find((e) => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const { guestId } = req.body;
    if (!guestId) {
      return res.status(400).json({ error: 'Guest ID is required' });
    }

    event.guests = event.guests.filter((g) => g.id !== guestId);
    event.updatedAt = new Date().toISOString();
    saveEvents();
    broadcastEventUpdate(event);

    res.json({ success: true, event: sanitizeEventForPublic(event) });
  });

  // Organizer removes any guest — ORGANIZER ONLY
  app.delete('/api/events/:id/guests/:guestId', (req, res) => {
    const event = events.find((e) => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const key = (req.headers['x-organizer-key'] as string) || (req.query.key as string);
    if (!key || key !== event.organizerKey) {
      return res.status(403).json({
        error: 'Permission Denied: Only the organizer has permission to remove guests.',
      });
    }

    const { guestId } = req.params;
    event.guests = event.guests.filter((g) => g.id !== guestId);
    event.updatedAt = new Date().toISOString();
    saveEvents();
    broadcastEventUpdate(event);

    res.json({ success: true, event: sanitizeEventForPublic(event) });
  });

  // Cancel / Delete Event — ORGANIZER ONLY
  app.delete('/api/events/:id', (req, res) => {
    const eventId = req.params.id;
    const index = events.findIndex((e) => e.id === eventId);
    if (index === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = events[index];
    const key = (req.headers['x-organizer-key'] as string) || (req.query.key as string);
    if (!key || key !== event.organizerKey) {
      return res.status(403).json({
        error: 'Permission Denied: Only the organizer can cancel or delete this event.',
      });
    }

    events.splice(index, 1);
    saveEvents();
    broadcastEventDeleted(eventId);
    res.json({ success: true });
  });

  // Global SSE Stream for event list changes
  app.get('/api/events-stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    globalSubscribers.add(res);

    req.on('close', () => {
      globalSubscribers.delete(res);
    });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
