# Make a Pie 🥧

A trust-based pie competition platform built with Next.js, where users can submit their pies, vote for others, and compete for the top spot on the leaderboard.

## Features

- 🔐 Trust-based authentication using real names
- 📸 Pie submission with images and descriptions
- ⭐ Fair voting system (3 stars per user)
- 📊 Real-time leaderboard
- 🎨 Modern, responsive UI using Tailwind CSS
- 🔄 Real-time updates using Prisma and PostgreSQL

## Tech Stack

- **Frontend:** Next.js 15, React 19
- **Styling:** Tailwind CSS, Radix UI Components
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Local Storage based trust system
- **Deployment:** Vercel

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/make-a-pie.git
cd make-a-pie
```

2. Install dependencies:
```bash
# Install PNPM if you haven't already
npm install -g pnpm

# Install project dependencies
pnpm install
```

3. Set up your database:
```bash
# Copy example env file
cp .env.example .env
# Update DATABASE_URL in .env
pnpm prisma generate
pnpm prisma db push
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) to view the application.

## Development Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm prisma     # Run Prisma commands
```

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Planned Features

### Near Term
- 📱 Progressive Web App support
- 🖼️ Multiple pie images per submission
- 💬 Comments and feedback system
- 📊 Advanced voting analytics

### Future Vision
- 🏆 Seasonal competitions
- 👥 User profiles and badges
- 🎯 Categories (fruit pies, savory pies, etc.)
- 📝 Recipe sharing (optional)
- 🎉 Virtual pie tasting events
- 🤝 Mentor-mentee system for pie making
- 🌍 International pie competition brackets
- 📱 Mobile app version

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors
- Inspired by the joy of baking and sharing
- Built with ❤️ and lots of 🥧

## Contact

For questions or suggestions, please open an issue or contact the maintainers.

---
Built with Next.js and deployed on Vercel
