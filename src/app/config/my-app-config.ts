export default{
  authConfig : {
    issuer: 'https://dev-37293701.okta.com/oauth2/default', // Issuer of token and url when authorizing with Okta Authorization Server
    clientId: '0oacu1f3p9OES7MTW5d7', // public identifier
    redirectUri: 'http://localhost:4200/login/callback',
    scopes:['openid','profile','email'] // provide access to information about a user
  }
}
