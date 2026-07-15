import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function getXrayToken() {
  const response = await axios.post(
    'https://xray.cloud.getxray.app/api/v2/authenticate',
    {
      client_id: process.env.XRAY_CLIENT_ID_TEST_NOVO,
      client_secret: process.env.XRAY_CLIENT_SECRET_TEST_NOVO
    }
  );

  return response.data;
}
