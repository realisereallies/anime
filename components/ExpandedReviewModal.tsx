'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface ReviewData {
  id: string;
  title: string;
  body: string;
  rating: number;
  animeTitle: string;
  authorName: string;
  createdAt: string;
  posterUrl?: string;
  _count?: {
    likes: number;
    dislikes: number;
    comments: number;
  };
}

interface ExpandedReviewModalProps {
  review: ReviewData;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExpandedReviewModal({ review, isOpen, onClose }: ExpandedReviewModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState(review._count?.likes || 0);
  const [dislikes, setDislikes] = useState(review._count?.dislikes || 0);
  const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(null);
  const [imageError, setImageError] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?reviewId=${review.id}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch {
      // Ошибка при загрузке комментариев
    }
  }, [review.id]);

  const fetchLikes = useCallback(async () => {
    try {
      const response = await fetch(`/api/likes?reviewId=${review.id}`);
      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        setDislikes(data.dislikes);
      }
    } catch {
      // Ошибка при загрузке лайков
    }
  }, [review.id]);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
      fetchLikes();
    }
  }, [isOpen, review.id, fetchComments, fetchLikes]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Необходимо войти в систему');
        return;
      }

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newComment,
          reviewId: review.id
        })
      });

      if (response.ok) {
        setNewComment('');
        fetchComments();
      } else {
        alert('Ошибка при добавлении комментария');
      }
    } catch {
      alert('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeDislike = async (action: 'like' | 'dislike') => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Необходимо войти в систему');
        return;
      }

      const newAction = userAction === action ? 'remove' : action;

      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reviewId: review.id,
          action: newAction
        })
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setUserAction(newAction === 'remove' ? null : newAction);
      }
    } catch {
      // Ошибка при обновлении лайка/дизлайка
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-pink-200">
          <h2 className="text-2xl font-bold text-pink-800">Отзыв</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Review Content */}
          <div className="p-6">
            {/* Poster */}
            {review.posterUrl && (
              <div className="w-full h-64 bg-pink-50 relative overflow-hidden rounded-lg mb-6">
                {!imageError ? (
                  <Image 
                    src={review.posterUrl} 
                    alt={`Постер ${review.animeTitle}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-rose-500">
                    <div className="text-white text-center">
                      <div className="text-6xl mb-4">🎬</div>
                      <div className="text-xl font-medium">{review.animeTitle}</div>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-pink-700 bg-opacity-80 text-white px-4 py-2 rounded-full text-lg font-medium">
                  {review.animeTitle}
                </div>
              </div>
            )}

            {/* Review Info */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-3xl font-bold text-pink-800">{review.title}</h3>
                <div className="text-yellow-400 text-2xl font-bold">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              <p className="text-pink-700 text-lg leading-relaxed mb-6">{review.body}</p>
              
              <div className="flex justify-between items-center text-pink-600">
                <span className="font-medium text-lg">Автор: {review.authorName}</span>
                <span className="text-lg">{formatDate(review.createdAt)}</span>
              </div>
            </div>

            {/* Like/Dislike Buttons */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-pink-50 rounded-lg">
              <button
                onClick={() => handleLikeDislike('like')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  userAction === 'like' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white text-green-600 border border-green-300 hover:bg-green-50'
                }`}
              >
                <span>👍</span>
                <span>{likes}</span>
              </button>
              <button
                onClick={() => handleLikeDislike('dislike')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  userAction === 'dislike' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-red-600 border border-red-300 hover:bg-red-50'
                }`}
              >
                <span>👎</span>
                <span>{dislikes}</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="border-t border-pink-200 pt-6">
              <h4 className="text-xl font-semibold text-pink-800 mb-4">
                Комментарии ({comments.length})
              </h4>

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Напишите ваш комментарий..."
                  className="w-full p-4 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="mt-2 bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Отправка...' : 'Отправить комментарий'}
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-pink-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-pink-800">
                        {comment.user.name || comment.user.email}
                      </span>
                      <span className="text-sm text-pink-600">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-pink-700">{comment.content}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-pink-600 text-center py-8">
                    Пока нет комментариев. Будьте первым!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
