/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module ImplicitMSALAuthenticationProvider
 */
import { InteractionRequiredAuthError,UserAgentApplication } from "msal";
/**
 * @class
 * Class representing ImplicitMSALAuthenticationProvider
 * @extends AuthenticationProvider
 */

function inIframe() {
   
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
export class ImplicitMSALAuthenticationProvider {
  /**
   * @public
   * @constructor
   * Creates an instance of ImplicitMSALAuthenticationProvider
   * @param {UserAgentApplication} msalApplication - An instance of MSAL UserAgentApplication
   * @param {MSALAuthenticationProviderOptions} options - An instance of MSALAuthenticationProviderOptions
   * @returns An instance of ImplicitMSALAuthenticationProvider
   */
  constructor(msalApplication, options) {
    this.options = options;
    this.msalApplication = msalApplication;
  }
  /**
   * @public
   * @async
   * To get the access token
   * @param {AuthenticationProviderOptions} authenticationProviderOptions - The authentication provider options object
   * @returns The promise that resolves to an access token
   */
  getAccessToken(authenticationProviderOptions) {
      var that = this
    return new Promise(async (resolve, reject) => {
      const options = authenticationProviderOptions;
      let scopes;
      if (typeof options !== "undefined") {
        scopes = options.scopes;
      }
      if (typeof scopes === "undefined" || scopes.length === 0) {
        scopes = this.options.scopes;
      }
      if (scopes.length === 0) {
        const error = new Error();
        error.name = "EmptyScopes";
        error.message = "Scopes cannot be empty, Please provide a scopes";
        throw error;
      }

      that.msalApplication.handleRedirectCallback((error, response) => {
        debugger;
        if (error) {
          return reject(error);
        }
      });




      if (this.msalApplication.getAccount()) {
        const tokenRequest = {
          scopes
        };
        try {
          const authResponse = await this.msalApplication.acquireTokenSilent(
            tokenRequest
          );
          resolve(authResponse.accessToken);
        } catch (error) {
          if (error instanceof InteractionRequiredAuthError) {
            try {
              if (inIframe()) {
                const authResponse = await this.msalApplication.acquireTokenPopup(
                  tokenRequest
                );
                resolve(authResponse.accessToken);
              } else {
                  debugger
              }
            } catch (error) {
                debugger
              reject(error);
            }
          } else {
            debugger
            reject(error);
          }
        }
      } else {
        try {
          const tokenRequest = {
            scopes
          };
          if (inIframe()) {
            await this.msalApplication.loginPopup(tokenRequest);
            const authResponse = await this.msalApplication.acquireTokenSilent(
              tokenRequest
            );
            resolve(authResponse.accessToken);
          } else {
            
           that.msalApplication.loginRedirect(tokenRequest);
            return; // should have been redirected now
          }
        } catch (error) {
            
          reject(error);
        }
      }
    });
  }
}
