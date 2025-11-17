#!/bin/bash

# Tomcat停止スクリプト
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export CATALINA_HOME=$SCRIPT_DIR/tomcat

echo "Stopping Tomcat..."
$CATALINA_HOME/bin/shutdown.sh

