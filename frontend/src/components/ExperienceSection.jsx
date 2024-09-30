import { useState } from "react";

const ExperienceSection = ({userData,isOwnProfile, onSave}) => {
  const [isEditing, setIsEditing] = useState(false);
	const [experiences, setExperiences] = useState(userData.experience || []);
	const [newExperience, setNewExperience] = useState({
		title: "",
		company: "",
		startDate: "",
		endDate: "",
		description: "",
		currentlyWorking: false,
	});


  return <div>ExperienceSection</div>;
};

export default ExperienceSection;
