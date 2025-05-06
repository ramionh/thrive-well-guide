
import { StepConfig } from "../../../types/motivation";
import RewardsCreateIncentive from "../../../RewardsCreateIncentive";
import NarrowingDownRewards from "../../../NarrowingDownRewards";
import RewardsEventsActivities from "../../../RewardsEventsActivities";
import RewardsFromPeopleWhoMatter from "../../../RewardsFromPeopleWhoMatter";
import DealingWithSetbacksStressCheck from "../../../DealingWithSetbacksStressCheck";
import DealingWithSetbacksSelfCare from "../../../DealingWithSetbacksSelfCare"; 
import DealingWithSetbacksRecommit from "../../../DealingWithSetbacksRecommit";
import TakingAnotherStepTowardChange from "../../../TakingAnotherStepTowardChange";
import BeConsistent from "../../../BeConsistent";
import GetOrganized from "../../../GetOrganized";
import SeekPositiveInformation from "../../../SeekPositiveInformation";
import SmallSteps from "../../../SmallSteps";
import SettingCeilingFloor from "../../../SettingCeilingFloor";
import ThinkingAssertively from "../../../ThinkingAssertively";
import HelpfulIdeas from "../../../HelpfulIdeas";
import ExceptionsToRule from "../../../ExceptionsToRule";
import MonitoringYourProgress from "../../../MonitoringYourProgress";
import Affirmations from "../../../Affirmations";
import RevisitValues from "../../../RevisitValues";
import AssessingImportanceStepsForward from "../../../AssessingImportanceStepsForward";
import IdentifyingStepsToGoal from "../../../IdentifyingStepsToGoal";
import ChangeYourPlan from "../../../ChangeYourPlan";
import PrioritizingChange from "../../../PrioritizingChange";
import MakingGoalMeasurable from "../../../MakingGoalMeasurable";
import FocusedHabitsSelector from "../../../FocusedHabitsSelector";
import AFinalWord from "../../../AFinalWord";

export const rewardsSteps: StepConfig[] = [
  {
    id: 66,
    title: "Rewards Create an Incentive to Change",
    description: "How rewards strengthen motivation",
    component: (onComplete) => <RewardsCreateIncentive onComplete={onComplete} />,
    nextStepNumber: 67,
    nextStepName: "Narrowing Down Rewards",
    stepName: "Rewards Create an Incentive to Change"
  },
  {
    id: 67,
    title: "Narrowing Down Rewards",
    description: "Selecting your top motivating rewards",
    component: (onComplete) => <NarrowingDownRewards onComplete={onComplete} />,
    nextStepNumber: 68,
    nextStepName: "Rewards: Events and Activities",
    stepName: "Narrowing Down Rewards"
  },
  {
    id: 68,
    title: "Rewards: Events and Activities",
    description: "Using activities as motivation",
    component: (onComplete) => <RewardsEventsActivities onComplete={onComplete} />,
    nextStepNumber: 69,
    nextStepName: "Rewards from People Who Matter", 
    stepName: "Rewards: Events and Activities"
  },
  {
    id: 69,
    title: "Rewards from People Who Matter",
    description: "Social support as motivation",
    component: (onComplete) => <RewardsFromPeopleWhoMatter onComplete={onComplete} />,
    nextStepNumber: 70,
    nextStepName: "Dealing With Setbacks: Stress Check",
    stepName: "Rewards from People Who Matter"
  },
  {
    id: 70,
    title: "Dealing With Setbacks: Stress Check",
    description: "Evaluate your stress levels",
    component: (onComplete) => <DealingWithSetbacksStressCheck onComplete={onComplete} />,
    nextStepNumber: 71,
    nextStepName: "Dealing With Setbacks: Self-Care",
    stepName: "Dealing With Setbacks: Stress Check"
  },
  {
    id: 71,
    title: "Dealing With Setbacks: Self-Care",
    description: "Practicing self-care during setbacks",
    component: (onComplete) => <DealingWithSetbacksSelfCare onComplete={onComplete} />,
    nextStepNumber: 72,
    nextStepName: "Dealing With Setbacks: Recommit",
    stepName: "Dealing With Setbacks: Self-Care"
  },
  {
    id: 72,
    title: "Dealing With Setbacks: Recommit",
    description: "Getting back on track after setbacks",
    component: (onComplete) => <DealingWithSetbacksRecommit onComplete={onComplete} />,
    nextStepNumber: 73,
    nextStepName: "Taking Another Step Toward Change",
    stepName: "Dealing With Setbacks: Recommit"
  },
  {
    id: 73,
    title: "Taking Another Step Toward Change",
    description: "Moving forward with your journey",
    component: (onComplete) => <TakingAnotherStepTowardChange onComplete={onComplete} />,
    nextStepNumber: 74,
    nextStepName: "Be Consistent",
    stepName: "Taking Another Step Toward Change"
  },
  {
    id: 74,
    title: "Be Consistent",
    description: "Building consistency in your habits",
    component: (onComplete) => <BeConsistent onComplete={onComplete} />,
    nextStepNumber: 75,
    nextStepName: "Get Organized",
    stepName: "Be Consistent"
  },
  {
    id: 75,
    title: "Get Organized",
    description: "Organizing your fitness routine",
    component: (onComplete) => <GetOrganized onComplete={onComplete} />,
    nextStepNumber: 76,
    nextStepName: "Seek Positive Information",
    stepName: "Get Organized"
  },
  {
    id: 76,
    title: "Seek Positive Information",
    description: "Finding helpful resources",
    component: (onComplete) => <SeekPositiveInformation onComplete={onComplete} />,
    nextStepNumber: 77,
    nextStepName: "Small Steps",
    stepName: "Seek Positive Information"
  },
  {
    id: 77,
    title: "Small Steps",
    description: "Taking small steps toward your goal",
    component: (onComplete) => <SmallSteps onComplete={onComplete} />,
    nextStepNumber: 78,
    nextStepName: "Setting Ceiling & Floor",
    stepName: "Small Steps"
  },
  {
    id: 78,
    title: "Setting Ceiling & Floor",
    description: "Creating boundaries for your goals",
    component: (onComplete) => <SettingCeilingFloor onComplete={onComplete} />,
    nextStepNumber: 79,
    nextStepName: "Thinking Assertively",
    stepName: "Setting Ceiling & Floor"
  },
  {
    id: 79,
    title: "Thinking Assertively",
    description: "Developing an assertive mindset",
    component: (onComplete) => <ThinkingAssertively onComplete={onComplete} />,
    nextStepNumber: 80,
    nextStepName: "Helpful Ideas",
    stepName: "Thinking Assertively"
  },
  {
    id: 80,
    title: "Helpful Ideas",
    description: "Collecting helpful tips and ideas",
    component: (onComplete) => <HelpfulIdeas onComplete={onComplete} />,
    nextStepNumber: 81,
    nextStepName: "Exceptions to Rule",
    stepName: "Helpful Ideas"
  },
  {
    id: 81,
    title: "Exceptions to Rule",
    description: "Finding appropriate exceptions",
    component: (onComplete) => <ExceptionsToRule onComplete={onComplete} />,
    nextStepNumber: 82,
    nextStepName: "Monitoring Your Progress",
    stepName: "Exceptions to Rule"
  },
  {
    id: 82,
    title: "Monitoring Your Progress",
    description: "Tracking your journey effectively",
    component: (onComplete) => <MonitoringYourProgress onComplete={onComplete} />,
    nextStepNumber: 83,
    nextStepName: "Affirmations",
    stepName: "Monitoring Your Progress"
  },
  {
    id: 83,
    title: "Affirmations",
    description: "Using positive affirmations",
    component: (onComplete) => <Affirmations onComplete={onComplete} />,
    nextStepNumber: 84,
    nextStepName: "Revisit Values",
    stepName: "Affirmations"
  },
  {
    id: 84,
    title: "Revisit Values",
    description: "Reconnecting with your values",
    component: (onComplete) => <RevisitValues onComplete={onComplete} />,
    nextStepNumber: 85,
    nextStepName: "Assessing Importance: Steps Forward",
    stepName: "Revisit Values"
  },
  {
    id: 85,
    title: "Assessing Importance: Steps Forward",
    description: "Evaluating what matters most now",
    component: (onComplete) => <AssessingImportanceStepsForward onComplete={onComplete} />,
    nextStepNumber: 86,
    nextStepName: "Identifying Steps to Goal",
    stepName: "Assessing Importance: Steps Forward"
  },
  {
    id: 86,
    title: "Identifying Steps to Goal",
    description: "Breaking down your path to success",
    component: (onComplete) => <IdentifyingStepsToGoal onComplete={onComplete} />,
    nextStepNumber: 87,
    nextStepName: "Change Your Plan",
    stepName: "Identifying Steps to Goal"
  },
  {
    id: 87,
    title: "Change Your Plan",
    description: "Adjusting your approach as needed",
    component: (onComplete) => <ChangeYourPlan onComplete={onComplete} />,
    nextStepNumber: 88,
    nextStepName: "Prioritizing Change",
    stepName: "Change Your Plan"
  },
  {
    id: 88,
    title: "Prioritizing Change",
    description: "Focusing on what matters most",
    component: (onComplete) => <PrioritizingChange onComplete={onComplete} />,
    nextStepNumber: 89,
    nextStepName: "Making Your Goal Measurable",
    stepName: "Prioritizing Change"
  },
  {
    id: 89,
    title: "Making Your Goal Measurable",
    description: "Setting concrete metrics for success",
    component: (onComplete) => <MakingGoalMeasurable onComplete={onComplete} />,
    nextStepNumber: 90,
    nextStepName: "Focused Habits Selector",
    stepName: "Making Your Goal Measurable"
  },
  {
    id: 90,
    title: "Focused Habits Selector",
    description: "Choose habits to focus on",
    component: (onComplete) => <FocusedHabitsSelector onComplete={onComplete} />,
    nextStepNumber: 91,
    nextStepName: "A Final Word: Your Fitness Journey Begins Now!",
    stepName: "Focused Habits Selector"
  },
  {
    id: 91,
    title: "A Final Word: Your Fitness Journey Begins Now!",
    description: "Complete your motivation journey",
    component: (onComplete) => <AFinalWord onComplete={onComplete} />,
    stepName: "A Final Word: Your Fitness Journey Begins Now!"
  }
];
