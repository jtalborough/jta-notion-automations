  GNU nano 4.8                                        deploy.sh                                                  
#!/bin/bash

#replace this with the path of your project on the VPS
cd ~/jta-notion-automations

#pull from the branch
git pull origin main

# followed by instructions specific to your project that you used to do manually
npm install
export PATH=~/.npm-global/bin:$PATH
source ~/.profile
pm2 kill
doppler run -- pm2 start app.js -f  --watch
