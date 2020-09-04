Simple Auth Implementation Demo
by Sheldon Frith

Front-End: SSR HTML using Pug(Jade) view engine (hosted on same server as backend)
Back-End: Node.js, Express.js, Loopback4, Passport, Hosted on AWS

Loopback-specific code taken from @loopback/example-passport-login.

Current State of this project:
  -user data stored in local storage, not in a database (in order to save on server costs)
  -loopback handling of local user accounts not working quite how I want it. Loopback 4 is new and the documentation is still a little rough, so I am still in the process of figuring out how to customize the code to my liking. I have implemented authentication in express without using Loopback middleware, and I can implement OAuth fine, but I'm not experienced enough yet to be confident working with passwords and user accounts without using a well-tested library middleware. Will be working on this skillset.
