#!/usr/bin/env bash
# We need to get the IPv4 version so that Android emulator can connect to the server
ip_pattern='192\.168\.[0-9]*\.[0-9]*'
host=`ifconfig | grep -oh $ip_pattern | head -1`
server_port=3000
# Update HOST
sed -i '' "s|.*API_URL=.*|API_URL=http://$host:$server_port/|" ./fastlane/.env.dev

