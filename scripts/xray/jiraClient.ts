import axios from 'axios';
import { config } from './config';

export class JiraClient {

  private authHeader() {

    const token = Buffer
      .from(
        `${config.jiraEmail}:${config.jiraApiToken}`
      )
      .toString('base64');

    return {
      Authorization: `Basic ${token}`,
      Accept: 'application/json'
    };
  }

  async testarConexao() {

    const response = await axios.get(
      `${config.jiraBaseUrl}/rest/api/3/project/${config.projectKey}`,
      {
        headers: this.authHeader()
      }
    );

    return response.data;
  }
}
