# Real-Time Chat Application

A modern real-time chat application built with Next.js, Prisma, MongoDB, Pusher, and Cloudinary.

## Features

* User Authentication
* Real-time messaging with Pusher
* Online/Offline user status
* Private conversations
* Image sharing with Cloudinary
* Message deletion
* Message read receipts (Seen status)
* Last read timestamp tracking
* Responsive UI
* Dark/Light theme support

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* React Hook Form
* React Query

### Backend

* Next.js Route Handlers
* Prisma ORM
* MongoDB

### Realtime

* Pusher

### Media Storage

* Cloudinary

## Installation

### Clone Repository

```bash
git clone https://github.com/Reem99-sina/messager
cd chat-app
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="mongodb+srv://reemsina:reemsina@cluster0.bsibg3y.mongodb.net/test"
NEXTAUTH_SECRET=NEXTAUTH_SECRET
GITHUB_ID=57f967eb72cf822707b6
GITHUB_SECRET=f783fe8335ed501c04e02cf8aff60d0d971380ab
GOOGLE_CLIENT_ID=785244684789-fpn3e4oe81q9ido274md3vjh11k87ip1.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dbgqtdyw9
NEXT_PUBLIC_CLOUDINARY_API_KEY=935349317259654
NEXT_PUBLIC_CLOUDINARY_API_SECRET=1NQlZ7dnvmUsxI7hA0m9xjv7ZV4
PUSHER_APP_ID = 1766171
NEXT_PUBLIC_PUSHER_APP_KEY = efa0a431ee67f6e32861
PUSHER_SECRET = b495c7823a042bde74dd
NODE_ENV=development
CLUSTER = eu
EMAIL_USER=reemsina2@gmail.com
EMAIL_PASS=A6dg7ia4@
PASSWORD_SECRET=ewrr qaml sknk reeg
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Prisma

Generate Prisma Client:

```bash
npx prisma generate
```

Push Schema:

```bash
npx prisma db push
```

### Run Development Server

```bash
npm run dev
```

Application will be available at:

```text
http://localhost:3000
```

## Database Structure

### User

* id
* name
* email
* password
* avatarUrl
* isVerified

### Conversation

* id
* title
* participants
* messages

### Message

* id
* body
* imageUrl
* imageName
* senderId
* conversationId
* createdAt

### MessageSeen

* id
* messageId
* userId
* seenAt

### ConversationParticipant

* id
* userId
* conversationId
* lastReadAt

## Read Receipts

The application tracks message reads using:

* `ConversationParticipant.lastReadAt`
* `MessageSeen`

This allows:

* Seen status
* Last active information
* Read tracking per user



