import * as Icons from 'lucide-react';

export default function getIcon(iconName) {
  const Icon = Icons[iconName] || Icons.Smile;
  // Return a function that accepts props and returns the icon component
  return (props) => <Icon {...props} />;
}