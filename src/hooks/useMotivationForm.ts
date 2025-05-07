import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { useMotivationStepsDB } from "@/hooks/motivation/useMotivationStepsDB";

export interface MotivationFormOptions<T, U = Record<string, any>> {
    tableName: string;
    initialState: T;
    parseData?: (data: any) => T;
    transformData?: (formData: T) => U;
    onSuccess?: () => void;
    stepNumber?: number;
    nextStepNumber?: number;
    stepName?: string;
    nextStepName?: string;
}

/**
 * Main hook for motivation forms that combines data fetching and submission
 */
export const useMotivationForm<T extends Record<string, any>, U extends Record<string, any> = Record<string, any>>(
    options: MotivationFormOptions<T, U>
) => {
    const {
        tableName,
        initialState,
        onSuccess,
        parseData,
        transformData,
        stepNumber,
        nextStepNumber,
        stepName,
        nextStepName
    } = options;

    const { user } = useUser();
    const { toast } = useToast();
    const { markStepComplete } = useMotivationStepsDB();

    const [formData, setFormData] = useState<T>(initialState);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const fetchAttempted = useRef(false);

    // Fetch existing data when component mounts
    const fetchData = async () => {
        if (!user || fetchAttempted.current) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            console.log(`Fetching data from ${tableName} for user ${user.id}`);

            const { data, error } = await supabase
                .from(tableName as any)
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error && error.code !== "PGRST116") {
                throw error;
            }

            if (data) {
                console.log(`Raw data from ${tableName}:`, data);

                let parsedData: T;
                if (parseData) {
                    parsedData = parseData(data);
                } else {
                    // Default simple parsing
                    parsedData = { ...initialState };
                    Object.keys(data).forEach(key => {
                        const camelKey = key.replace(/([-_][a-z])/g, group =>
                            group.toUpperCase().replace('-', '').replace('_', '')
                        );

                        if (camelKey in parsedData) {
                            (parsedData as any)[camelKey] = data[key];
                        }
                    });
                }

                console.log(`Parsed data for ${tableName}:`, parsedData);
                setFormData(parsedData);
            }

            setError(null);
        } catch (err: any) {
            console.error(`Error fetching data from ${tableName}:`, err);
            setError(err);
            toast({
                title: "Error",
                description: "Failed to load your data",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
            fetchAttempted.current = true;
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        if (user && !fetchAttempted.current) {
            fetchData();
        } else if (!user) {
            setIsLoading(false);
        }
    }, [user?.id]);

    /**
     * Update a specific field in the form data
     */
    const updateForm = (field: keyof T, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    /**
     * Submit form data to the database
     */
    const submitForm = async () => {
        if (!user) {
            toast({
                title: "Error",
                description: "You must be logged in to save your data",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);
        try {
            console.log(`Submitting form data to ${tableName}:`, formData);

            // Prepare data for database
            const dataToSubmit = {
                user_id: user.id,
                ...formData,
            };

            console.log(`Transformed data for ${tableName}:`, dataToSubmit);

            const { error } = await supabase
                .from(tableName as any)
                .upsert(dataToSubmit, { onConflict: "user_id" }); // Use upsert

            if (error) {
                throw error;
            }

            // If stepNumber is provided, mark the step as complete
            if (stepNumber) {
                await markStepComplete(user.id, stepNumber, [], onSuccess);
            } else {
                toast({
                    title: "Success",
                    description: "Your data has been saved",
                });

                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (err: any) {
            console.error(`Error saving data to ${tableName}:`, err);
            toast({
                title: "Error",
                description: "Failed to save your data",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData,
        isLoading,
        isSaving,
        error,
        fetchData,
        updateForm,
        submitForm
    };
};