import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, MapPin } from "lucide-react";

const NotFound = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />

      <div className="relative text-center px-4 animate-fade-in-up">
        <div className="text-[150px] md:text-[200px] font-black bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent leading-none mb-4">
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-deep-earth mb-4">
          Lost in the Mountains? 🏔️
        </h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          The sacred path you seek doesn't exist here. Like a wandering pilgrim,
          let us guide you back to the monastery gates.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-5 rounded-xl shadow-lg shadow-orange-200 gap-2">
              <Home className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
          <Link to="/">
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 px-8 py-5 rounded-xl gap-2"
            >
              <MapPin className="w-4 h-4" />
              Explore Map
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
