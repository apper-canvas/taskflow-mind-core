import * as Icons from 'lucide-react';

export default function getIcon(iconName) {
  // Return the icon component itself instead of JSX
  return Icons[iconName] || Icons.Smile;
}