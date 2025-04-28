
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const RatingScaleDescription: React.FC = () => {
  return (
    <Card className="bg-purple-50 border-purple-200 my-4">
      <CardContent className="p-4 text-sm text-purple-900">
        <h3 className="font-semibold mb-2">Rating Scale:</h3>
        <div className="space-y-2">
          <p><strong>5 =</strong> I think about this stressor several times an hour. This stressor makes it difficult for me to concentrate on anything else in my life. When I think about this stressor, sometimes my stomach feels upset or I get a headache. Sometimes I can't sleep at night because I'm always thinking about this stressor. I have no idea what I can do about this stressor.</p>
          
          <p><strong>4 =</strong> I think about this stressor five or more times a day, but I am able set it aside when I need to. Sometimes this stressor makes it hard for me to focus on the task at hand. This stressor causes me to feel tense in my shoulders, neck, and/or jaw. I have some ideas about how to handle this stressor but am unsure which option to choose.</p>
          
          <p><strong>3 =</strong> I think about this stressor three to four times a day, but it doesn't disrupt my normal daily routine. I may feel slight muscle tension. I have a plan to deal with this stressor and I think it will be successful.</p>
          
          <p><strong>2 =</strong> I think about this stressor one to two times a day. I usually do not experience any physical discomfort. I may have successfully dealt with this stressor before and believe I will be able to cope with it again.</p>
          
          <p><strong>1 =</strong> I think about this stressor infrequently, about one to three times a week. It does not disrupt my normal daily routine. I do not experience any physical discomfort. I have successfully dealt with this stressor before and believe I will be able to successfully cope with it again.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingScaleDescription;
