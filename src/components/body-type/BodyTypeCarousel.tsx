
import React, { useEffect, useRef, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { useBodyTypes } from "@/hooks/useBodyTypes";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

type BodyType = {
  id: string;
  name: string;
  bodyfat_range: string;
  population_percentage: string;
};

const BODYTYPE_SCALE = [
  "Ripped",
  "Elite",
  "Fit",
  "Average",
  "Overweight",
  "Obese",
];

const BodyTypeCarousel: React.FC = () => {
  const { bodyTypes, bodyTypeImages, isLoading, error } = useBodyTypes();
  const { user } = useUser();
  const [currentBodyTypeId, setCurrentBodyTypeId] = useState<string | null>(null);
  const [goalBodyTypeId, setGoalBodyTypeId] = useState<string | null>(null);
  const [defaultIndex, setDefaultIndex] = useState<number>(0);
  const carouselApiRef = useRef<CarouselApi | null>(null);

  // Fetch latest user body type and find current/goal indices
  useEffect(() => {
    const fetchLatestBodyType = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("user_body_types")
        .select("body_type_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!error && data && data.body_type_id) {
        setCurrentBodyTypeId(data.body_type_id);

        // Find this type's name and index
        const currType = bodyTypes.find((bt) => bt.id === data.body_type_id);
        if (currType) {
          const currIdx = BODYTYPE_SCALE.findIndex(
            (name) => name.toLowerCase() === currType.name.toLowerCase()
          );
          // Set defaultIndex to the current type's index in bodyTypes order
          const defaultBodyTypeIdx = bodyTypes.findIndex(
            (bt) => bt.id === currType.id
          );
          if (defaultBodyTypeIdx >= 0) setDefaultIndex(defaultBodyTypeIdx);

          if (currIdx > 0) {
            const goalName = BODYTYPE_SCALE[currIdx - 1];
            const goalType = bodyTypes.find(
              (bt) => bt.name.toLowerCase() === goalName.toLowerCase()
            );
            if (goalType) setGoalBodyTypeId(goalType.id);
            else setGoalBodyTypeId(null);
          } else {
            setGoalBodyTypeId(null);
          }
        } else {
          setGoalBodyTypeId(null);
          setDefaultIndex(0);
        }
      }
    };
    if (user && bodyTypes.length > 0) {
      fetchLatestBodyType();
    }
  }, [user, bodyTypes]);

  // Go to current bodytype slide when currentBodyTypeId or defaultIndex change
  useEffect(() => {
    if (carouselApiRef.current && bodyTypes.length > 0 && defaultIndex !== undefined) {
      carouselApiRef.current.scrollTo(defaultIndex, false);
    }
  }, [defaultIndex, bodyTypes.length]);

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Loading body types...</div>;
  }
  if (error) {
    return <div className="py-8 text-center text-destructive">Failed to load body types.</div>;
  }
  if (bodyTypes.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">No body types found.</div>;
  }

  return (
    <div className="mb-8 max-w-3xl mx-auto">
      <Carousel
        opts={{ align: "center" }}
        setApi={(api) => (carouselApiRef.current = api)}
      >
        <CarouselContent>
          {bodyTypes.map((bodyType) => {
            // Determine status for highlight
            const isCurrent = bodyType.id === currentBodyTypeId;
            const isGoal = bodyType.id === goalBodyTypeId;
            let highlightClass = "bg-white border";
            if (isCurrent) highlightClass = "border-2 border-yellow-200 bg-[#FEF7CD]";
            else if (isGoal) highlightClass = "border-2 border-green-200 bg-[#F2FCE2]";
            return (
              <CarouselItem key={bodyType.id} className="flex justify-center">
                <div
                  className={`relative flex flex-col items-center w-48 p-4 rounded-xl shadow transition-shadow duration-150 animate-fade-in
                  ${highlightClass}
                  `}
                >
                  {(isCurrent || isGoal) && (
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 z-10
                      px-3 py-1 rounded-full text-xs font-semibold shadow
                      ${isCurrent ? "bg-yellow-400 text-black border border-yellow-600" : ""}
                      ${isGoal ? "bg-green-500 text-white border border-green-700" : ""}
                      `}
                      style={{
                        top: 16,
                        minWidth: 54,
                        textAlign: "center"
                      }}
                    >
                      {isCurrent ? "Current" : isGoal ? "Goal" : ""}
                    </div>
                  )}
                  <div className="w-32 h-32 rounded-lg overflow-hidden mb-2 bg-soft-gray border">
                    <img
                      src={bodyTypeImages[bodyType.id] || "/placeholder.svg"}
                      alt={bodyType.name}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="text-center w-full">
                    <div className="font-bold text-lg mb-1">{bodyType.name}</div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Body Fat: {bodyType.bodyfat_range}
                    </div>
                    <div className="text-xs text-gray-500">
                      Population: {bodyType.population_percentage}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default BodyTypeCarousel;
