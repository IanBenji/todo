# Full-Stack Todo Application

A modern, real-time todo application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 User authentication and authorization
- ✨ Real-time todo updates
- 📱 Responsive design
- 🎯 Task prioritization
- 📅 Due date management
- 🔄 Real-time synchronization
- 🚀 High performance
- 🛡️ Secure data handling

## Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://github.com/colinhacks/zod) - Schema validation

### Backend
- [Supabase](https://supabase.com/) - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- A Supabase account

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add:
```plaintext
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
todo-app/
├── app/                   # Next.js app directory
├── components/           # Reusable UI components
├── utils/               # Helper functions and utilities
├── types/               # TypeScript type definitions
├── public/              # Static assets
└── styles/              # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (when implemented)

## Database Schema

### Todos Table
```sql
create table todos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  title text not null,
  description text,
  is_completed boolean default false,
  due_date timestamptz,
  priority text check (priority in ('low', 'medium', 'high')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## API Routes

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
