#!/usr/bin/env bash
# We need to get the IPv4 version so that Android emulator can connect to the server
host=`ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'`
server_port=3000
# Update HOST
sed -i '' "s|.*API_URL=.*|API_URL=http://$host:$server_port/|" ./fastlane/.env.dev

