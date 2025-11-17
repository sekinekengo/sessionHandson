#!/bin/bash

# Tomcat起動スクリプト
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export JAVA_HOME=~/.sdkman/candidates/java/21.0.8-tem
export PATH=$JAVA_HOME/bin:$PATH
export CATALINA_HOME=$SCRIPT_DIR/tomcat

echo "Starting Tomcat..."
$CATALINA_HOME/bin/startup.sh

