# Example project with nest.js and react

## Introduction

The project shows how to implement an application using next.js and WebSocket as backend and React as frontend.

## Setup

Installing all dependencies for the backend and frontend

```bash
npm install
```

Start the backend and frontend servers

```bash
npm start
```

Of course, you can also switch to the individual folders and execute the commands there.

## Description

### Backend

The backend was implemented with [nest.js](https://nestjs.com/). There, an events gateway was implemented, which provides a WebSocket. You can connect to this WebSocket to book seats on a fictitious event. You can connect to the WebSocket with the URL `ws://localhost:3001/?user=YourUsername`. Please make sure that you enter your username as the parameter you want to log in with. If this is not done, you will get an error message and the connection will be aborted.

Basically, two events are available.

1. `field` - Event, which shows you the current field. Thereby a `0` stands for a free place, `1` for an already occupied place and a `2` for a place which you have already bought yourself.

Example request:

```json
{
  "event": "field"
}
```

2. `buy` - Event, which allows you to buy a ticket. In doing so, you must include a position that you want to buy. If you want to buy a place which is already sold or nonexistent you will get an error with a corresponding message.
   <br>
   If you buy a valid place the updated field is sent to <span style="color: red;">EVERY</span> client. Your username will be saved on the server, but just like in the `field`-event, the field itself will just consist of 0, 1 or 2s.

Example request:

```json
{
  "event": "buy",
  "data": {
    "pos": [2, 0]
  }
}
```

This application currently does not have a connection to a database and the bought tickets are currently stored in a variable, so that the event will be cleared after every server restart.

### Frontend

The frontend was develop with [React](https://reactjs.org/). In addition, [headlessui](https://headlessui.dev/) and [tailwindcss](https://tailwindcss.com/) were used.
<br>
The fictitious company EventBooking! is created for the website.
<br>
When you start the application, a login field appears where you have to enter a username. With this username the connection to the WebSocket will be established and with this username the tickets will be "bought".
<br>
After logging in, you will be redirected to the event page, where you will first see placeholder content for the title, date and description.
<br>
And below are the available seats. A green seat means that it is still available. A red seat means that it is already occupied. A blue seat means that you have already bought this seat.
<br>
When you click on an available space, it will be outlined in blue and added to the shopping cart. Only when you have clicked on Buy in the shopping cart, the ticket is purchased and completely marked in blue.

## TODOs

1. Writing tests for backend and frontend
2. Enable better logging for server
3. Visual application for an admin.
4. Connect to a database and rework everything to be more generic and work with multiple events.
