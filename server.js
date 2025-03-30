const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  let activeForms = {};
  let submittedForms = {};

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    socket.on("formData", (data) => {
      activeForms[data.id] = { ...data };
      io.emit("updateForms", { activeForms, submittedForms });
    });

    socket.on("formSubmit", (formData) => {
      const formId = formData.id;
      submittedForms[formId] = formData;
      io.emit("updateForms", { activeForms, submittedForms });
    });

    socket.on("updateForms", ({ activeForms, submittedForms }) => {
      io.emit("updateForms", { activeForms, submittedForms });
    });

    socket.on("resetForms", () => {
      activeForms = {};
      io.emit("updateForms", { activeForms, submittedForms });
    });

    socket.on('patientStatus', (data) => {
      io.emit('patientStatus', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
