export const renderStars = (rating) => {
  if (isNaN(rating) || rating < 0 || rating > 5) {
    return "non-food";
  }
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {Array(fullStars).fill("★")}
      {halfStar && "⯪"}
      {Array(emptyStars).fill("☆")}
    </>
  );
};
