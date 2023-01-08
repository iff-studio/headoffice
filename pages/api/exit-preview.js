export default async function exit(req, res) {
  const { path } = req.query
  // Exit the current user from "Preview Mode". This function accepts no args.
  res.clearPreviewData()

  // Redirect the user back to the index page.
  res.writeHead(307, { Location: path })
  res.end()
}
