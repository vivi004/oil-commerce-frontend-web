export interface Review {
  id: string;
  productId: string;
  userId: string;
  userFullName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  body: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  title?: string;
  body: string;
  images?: string[];
}

export interface RatingSummary {
  average: number;
  total: number;
  distribution: { [star: number]: number };
}
