# 🍌 Banana Peel

Check it out here: https://banana-peel.com

A collaborative image evolution platform where creativity slips into something unexpected. Drop a prompt, watch images transform through AI-powered generation, creating endless branches of visual creativity.

## 🎨 What is Banana Peel?

Banana Peel is a social image generation platform where:
- Users post original images that serve as creative starting points
- Community members can comment with text prompts to generate new variations
- Each prompt creates a new "branch" in the image evolution tree
- Comments can be nested, creating entire chains of image transformations
- The playful, sketch-style UI makes exploring image variations fun and engaging

## ✨ Features

- **Prompt-based Image Generation**: Comment with a text prompt to generate new image variations using Fal AI
- **Threading System**: Create branches and sub-branches of image evolutions
- **Real-time Updates**: Watch as images generate in real-time with status indicators
- **Social Features**: Like posts and comments, see what's trending
- **Keyboard Navigation**: Navigate through image threads with `j/k` keys, peek at originals with `Space`
- **Quirky UI**: Playful, hand-drawn aesthetic with tilted cards and sketch-style borders

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: Fal AI for image generation
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account
- Fal AI API key

### Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Fal AI
FAL_KEY=your_fal_api_key

# App URL (for production)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Installation

```bash
# Clone the repository
git clone https://github.com/blendi-remade/banana-peel.git

# Install dependencies
npm install

# Run database migrations
npx supabase db push

# Start development server
npm run dev
```

### Database Setup

Run the migrations in order:
1. `00001_create_profiles.sql` - User profiles
2. `00002_create_posts_comments.sql` - Posts and comments structure
3. `00003_add_likes.sql` - Likes functionality
4. `00004_add_generation_status.sql` - Image generation tracking

## 📖 Usage

1. **Sign in** with Google authentication
2. **Browse the feed** to see posts from the community
3. **Create a post** by uploading an image with a title
4. **Add prompts** to any image to generate variations
5. **Navigate threads** using keyboard shortcuts:
   - `j/k` - Navigate up/down through comments
   - `Tab` - Jump to next root comment
   - `Space` (hold) - Peek at the original image

## 🎯 Key Concepts

- **Root Image**: The original uploaded image
- **Prompt Comment**: A text description that generates a new image variation
- **Image Thread**: A chain of prompts and generated images
- **Generation Status**: Pending → Generating → Completed/Failed

## 🤝 Contributing

This project was built for a hackathon with the spirit of experimentation and fun. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Share your coolest image evolution chains!

## 📝 License

MIT License - feel free to use this project for your own creative experiments!

## 🙏 Acknowledgments

- Built with 🍌 at the hackathon
- Powered by Fal AI for image generation
- Inspired by the chaos of creative collaboration

---

*Remember: The best ideas often come from slipping on a banana peel of creativity!*