/** Client-side filter for admin user lists (name, username, email, phone, subscription). */
export function filterUsersBySearch(users, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return users;

  return users.filter((user) => {
    const haystack = [
      user.name,
      user.username,
      user.email,
      user.mobileNumber,
      user.subscription,
      user.accountStatus,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}
