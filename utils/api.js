import axios from "axios"

export const fetchContent = (query) => {
  if (process.env.previewToken) {
    // Content in draft mode is visible
    return axios({
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.previewToken}`,
      },
      url:
        "https://api-us-east-1.graphcms.com/v2/ckcmojoyd1vly01xo5ubkgptp/master",
      data: {
        query,
      },
    })
  } else {
    // Only published content is visible
    return axios({
      method: "post",
      url:
        "https://api-us-east-1.graphcms.com/v2/ckcmojoyd1vly01xo5ubkgptp/master",
      data: {
        query,
      },
    })
  }
}
