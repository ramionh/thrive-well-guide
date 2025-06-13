
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { History, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import HistoricalSummary from "./HistoricalSummary";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { format } from "date-fns";

const HistoryButton: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const { user } = useUser();

  // Fetch dates that have data to highlight them in the calendar
  const { data: availableDates } = useQuery({
    queryKey: ['available-dates', user?.id],
    queryFn: async () => {
      if (!user) return [];

      console.log('Fetching available dates for user:', user.id);
      const { data, error } = await supabase
        .from('daily_health_tracking')
        .select('date')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching available dates:', error);
        throw error;
      }
      
      console.log('Available dates from DB:', data);
      const dates = data?.map(item => new Date(item.date + 'T00:00:00')) || [];
      console.log('Processed available dates:', dates);
      return dates;
    },
    enabled: !!user
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      console.log('Date selected:', date);
      setSelectedDate(date);
      setCalendarOpen(false);
      setSummaryOpen(true);
    }
  };

  const isDateAvailable = (date: Date) => {
    if (!availableDates) return false;
    const dateString = format(date, 'yyyy-MM-dd');
    return availableDates.some(availableDate => 
      format(availableDate, 'yyyy-MM-dd') === dateString
    );
  };

  return (
    <>
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
            <Calendar className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-3">
            <div className="text-sm text-muted-foreground mb-2">
              Select a date to view your progress
            </div>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              className="pointer-events-auto"
              modifiers={{
                available: availableDates || []
              }}
              modifiersStyles={{
                available: {
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  fontWeight: 'bold'
                }
              }}
              disabled={(date) => date > new Date() || date < new Date('2020-01-01')}
            />
            {availableDates && availableDates.length > 0 && (
              <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                📅 Highlighted dates have recorded data ({availableDates.length} entries found)
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <HistoricalSummary 
        date={selectedDate}
        isOpen={summaryOpen}
        onClose={() => setSummaryOpen(false)}
      />
    </>
  );
};

export default HistoryButton;
