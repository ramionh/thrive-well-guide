
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useBodyTypes } from "@/hooks/useBodyTypes";

const BodyTypeCarousel: React.FC = () => {
  const { bodyTypes, bodyTypeImages, isLoading, error } = useBodyTypes();

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
      <Carousel opts={{ align: "center" }}>
        <CarouselContent>
          {bodyTypes.map((bodyType) => (
            <CarouselItem key={bodyType.id} className="flex justify-center">
              <div className="flex flex-col items-center w-48 p-4 rounded-xl bg-white shadow border hover:shadow-lg transition-shadow duration-150 animate-fade-in">
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
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default BodyTypeCarousel;
