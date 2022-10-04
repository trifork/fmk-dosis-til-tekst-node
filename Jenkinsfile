properties([
        buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '10')),
        githubProjectProperty(displayName: '', projectUrlStr: 'https://github.com/trifork/fmk-dosis-til-tekst-node/'),
        pipelineTriggers([pollSCM('H/5 * * * * ')])
])

pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                checkout([$class: 'GitSCM', branches: [[name: "*/main"]], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'fmk-dosis-til-tekst-node']], submoduleCfg: [], userRemoteConfigs: [[url: 'git@github.com:trifork/fmk-dosis-til-tekst-node.git']]])
            }
        }

        stage('build docker image and push') {
            steps {
                script {
                    configFileProvider([configFile(fileId: 'unique_userid', targetLocation: 'uniqueUserid.py')]) {
                        env.USERID = sh script: "python3 uniqueUserid.py dosistiltekst", returnStdout: true
                        env.USERID = env.USERID.trim()
                    }

                    def props = readJSON file: 'package.json'
                    env.VERSION=props.version
                    image = docker.build("registry.fmk.netic.dk/fmk/fmk-dosistiltekst-server:${env.VERSION}", "--build-arg USERID=${env.USERID} -f ./fmk-dosis-til-tekst-node/Dockerfile ./fmk-dosis-til-tekst-node")
                    image.push()
                    image.push('latest')
                }
            }
        }
    }

    post {
        failure {
            emailext body: '$DEFAULT_CONTENT',
                    recipientProviders: [culprits(), requestor()],
                    subject: '$DEFAULT_SUBJECT'
        }
        unstable {
            emailext body: '$DEFAULT_CONTENT',
                    recipientProviders: [culprits(), requestor()],
                    subject: '$DEFAULT_SUBJECT'
        }
        fixed {
            emailext body: '$DEFAULT_CONTENT',
                    recipientProviders: [culprits(), requestor()],
                    subject: '$DEFAULT_SUBJECT'
        }
    }
}