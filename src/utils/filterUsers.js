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

/** Subscription is active when expiry is a future date. */
export function hasActiveSubscription(user) {
  if (!user?.expiry) return false;
  const expiry = new Date(user.expiry);
  if (Number.isNaN(expiry.getTime())) return false;
  return expiry.getTime() > Date.now();
}

export function filterUsersBySubscription(users, subscriptionFilter) {
  if (subscriptionFilter === "active") {
    return users.filter(hasActiveSubscription);
  }
  if (subscriptionFilter === "expired") {
    return users.filter((user) => !hasActiveSubscription(user));
  }
  return users;
}

