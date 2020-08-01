import axios from 'axios'

export const fetchContent = (query) =>
  axios({
    method: 'post',
    url:
      'https://api-us-east-1.graphcms.com/v2/ckcmojoyd1vly01xo5ubkgptp/master',
    data: {
      query,
    },
  })
