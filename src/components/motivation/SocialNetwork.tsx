
import React from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocialNetwork } from "@/hooks/useSocialNetwork";

interface SocialNetworkProps {
  onComplete?: () => void;
}

const SocialNetwork: React.FC<SocialNetworkProps> = ({ onComplete }) => {
  const { entries, handleEntryChange, saveSocialNetworkMutation } = useSocialNetwork(onComplete);

  const handleSave = () => {
    saveSocialNetworkMutation.mutate(entries);
  };

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <Card className="p-6 bg-white shadow-lg border border-purple-200">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Social Support Network</h2>
            <div className="prose mb-6">
              <p className="text-purple-700 leading-relaxed">
                Research shows that social support is an essential element of reaching
                your fitness goals. Poor social support can derail someone's ability to change
                even if they are ready, willing, and able to change, so it's important to
                get a handle on your personal social network.
              </p>
              
              <p className="text-purple-600 leading-relaxed mt-4">
                Your social network is defined as the people you frequently
                encounter and socialize with at home, social gatherings, work, or
                school. Your network may include a spouse or partner, close family
                (mother, father, sister, brother, or even children), close friends, coworkers
                and colleagues, or other acquaintances.
              </p>
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6 bg-white shadow-lg border border-purple-200">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Your Social Network</h2>
            <div className="prose mb-6">
              <p className="text-purple-700">
                List the people and groups who make up your social network and rate them from 1 to 5.
              </p>
              <p className="text-sm text-purple-600 mt-2">
                On a scale of 1 to 5, rate how supportive each person or group is to
                your goal. A score of 1 indicates they are unsupportive and may even
                impede your fitness goal. A score of 5 indicates they would do anything
                within their ability to help you succeed.
              </p>
            </div>
            
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <div key={index} className="flex gap-4">
                  <Input
                    value={entry.person}
                    onChange={(e) => handleEntryChange(index, 'person', e.target.value)}
                    placeholder={`Person or group ${index + 1}`}
                    className="flex-1 bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={entry.rating || ''}
                    onChange={(e) => handleEntryChange(index, 'rating', parseInt(e.target.value) || 0)}
                    placeholder="Rating"
                    className="w-24 bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
              ))}

              <Button 
                onClick={handleSave}
                disabled={entries.every(e => e.person.trim() === '') || saveSocialNetworkMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6"
              >
                Complete This Step
              </Button>
            </div>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="text-purple-600" />
      <CarouselNext className="text-purple-600" />
    </Carousel>
  );
};

export default SocialNetwork;
