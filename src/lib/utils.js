export default function truncateText(text, maxLength) {
    const words = text.split(' ');
    const truncated = words.slice(0, maxLength).join(' ');
  
    if (words.length > maxLength) {
      return `${truncated} ...`;
    } else {
      return truncated;
    }
  }
  
 export function formatTimestampToDate(timestamp) {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}