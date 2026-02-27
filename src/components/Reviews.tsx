import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Video, Mic, LogIn, Star, Award, Send, Sparkles, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import coinImg from "@/assets/old-coin.jpg";

const Reviews = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);
  const [coins, setCoins] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text && !image && !video && !audio)
      return toast({
        title: "Empty Review",
        description: "Please add some content before submitting!",
        variant: "destructive",
      });

    const earnedCoins = Math.floor(Math.random() * 3) + 1;
    setCoins(coins + earnedCoins);

    setReviews([
      {
        id: Date.now(),
        text,
        image,
        video,
        audio,
        rating: rating || 5,
        coinsEarned: earnedCoins,
        username: user?.username || "Anonymous",
      },
      ...reviews,
    ]);

    toast({
      title: `+${earnedCoins} Heritage Coins earned! 🪙`,
      description: "Thank you for sharing your experience!",
    });

    setText("");
    setImage(null);
    setVideo(null);
    setAudio(null);
    setRating(0);
  };

  // If NOT logged in → show a beautiful CTA to login/signup
  if (!user) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 pt-20">
        <div className="text-center max-w-lg px-6 animate-fade-in-up">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-200 animate-glow-pulse">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-deep-earth mb-3">Share Your Experience</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Sign in to your Monastery360 account to write reviews, earn heritage coins,
            and contribute to our sacred community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-5 rounded-xl shadow-lg shadow-orange-200 gap-2 text-base">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 px-8 py-5 rounded-xl gap-2 text-base"
              >
                <Sparkles className="w-4 h-4" />
                Create Account
              </Button>
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            Earn heritage coins for every review — redeem for premium features!
          </p>
        </div>
      </section>
    );
  }

  // Logged in → show review form
  return (
    <section className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 animate-fade-in-up">
          <div>
            <h2 className="text-3xl font-bold text-deep-earth">Share Your Experience</h2>
            <p className="text-gray-500 mt-1">
              Welcome back, <span className="font-medium text-orange-600">{user.username}</span>! 🙏
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-md border border-orange-100">
            <img src={coinImg} alt="Heritage Coin" className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-lg font-bold text-amber-600">{coins}</p>
              <p className="text-[10px] text-gray-400 -mt-0.5">Heritage Coins</p>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-orange-100/50 mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Star Rating */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform duration-200 hover:scale-125"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${star <= (hoverRating || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200"
                      }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-gray-500 self-center">
                  {rating === 5 ? "Excellent!" : rating === 4 ? "Great" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <textarea
            className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-gray-700 bg-white/50 transition-all text-sm resize-none"
            placeholder="Tell us about your monastery visit — what moved you, what surprised you, what you learned... ✍️"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
          />

          {/* Media Uploads */}
          <div className="flex flex-wrap gap-3 mt-4 mb-6">
            <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all text-sm text-gray-500 hover:text-orange-600">
              <Camera className="w-4 h-4" />
              <span>{image ? "Image ✓" : "Add Image"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
              />
            </label>
            <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all text-sm text-gray-500 hover:text-orange-600">
              <Video className="w-4 h-4" />
              <span>{video ? "Video ✓" : "Add Video"}</span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => setVideo(URL.createObjectURL(e.target.files[0]))}
              />
            </label>
            <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all text-sm text-gray-500 hover:text-orange-600">
              <Mic className="w-4 h-4" />
              <span>{audio ? "Audio ✓" : "Add Audio"}</span>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => setAudio(URL.createObjectURL(e.target.files[0]))}
              />
            </label>
          </div>

          {/* Preview */}
          {(image || video) && (
            <div className="mb-5 rounded-xl overflow-hidden border border-gray-200">
              {image && <img src={image} alt="Preview" className="w-full max-h-48 object-cover" />}
              {video && <video src={video} controls className="w-full max-h-48" />}
            </div>
          )}

          <Button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-5 rounded-xl shadow-lg shadow-orange-200 gap-2 text-base transition-all hover:scale-[1.02]"
          >
            <Send className="w-4 h-4" />
            Submit Review
          </Button>
        </form>

        {/* Reviews List */}
        {reviews.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-deep-earth mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Your Reviews ({reviews.length})
            </h3>
            <div className="grid gap-5">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-orange-100/50 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white uppercase">
                          {review.username?.charAt(0) || "A"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-deep-earth">{review.username}</p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(review.id).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                      <img src={coinImg} alt="Coin" className="w-4 h-4 rounded-full" />
                      <span className="text-xs font-bold text-amber-600">+{review.coinsEarned}</span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"
                          }`}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  {review.text && <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.text}</p>}
                  {review.image && (
                    <img src={review.image} alt="Uploaded" className="w-full max-h-64 object-cover rounded-xl mb-3" />
                  )}
                  {review.video && (
                    <video src={review.video} controls className="w-full max-h-64 rounded-xl mb-3" />
                  )}
                  {review.audio && <audio src={review.audio} controls className="w-full" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {reviews.length === 0 && (
          <div className="text-center py-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
