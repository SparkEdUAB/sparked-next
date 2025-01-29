// Add these fields to your existing type
export type T_RawMediaContentFields = {
  // ... existing fields ...
  likes: number;
  dislikes: number;
  userReactions: {
    userId: string;
    type: 'like' | 'dislike';
    createdAt: Date;
  }[];
};