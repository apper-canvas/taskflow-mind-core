import * as Icons from 'lucide-react';

export default function getIcon(iconName) {
  // Get the icon component from the lucide-react library
  const IconComponent = Icons[iconName] || Icons.Smile;
  
  // Return a function that takes props and returns the component
  // This avoids direct JSX usage in a .js file
  return (props) => IconComponent(props);
}