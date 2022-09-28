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
                    env.VERSION=readJSON(file: 'package.json').version
                    image = docker.build("registry.fmk.netic.dk/fmk/fmk-dosistiltekst-server:${env.VERSION}", "-f ./fmk-dosis-til-tekst-node/Dockerfile ./fmk-dosis-til-tekst-node")
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