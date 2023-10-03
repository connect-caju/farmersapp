export const generateFormattedAdminPost = (adminPost) => {
  if (String(adminPost)?.split(" ").length > 1) {
    return String(adminPost)?.split(" ").join(".")?.toLowerCase()
  }
  return adminPost?.toLowerCase()
}
