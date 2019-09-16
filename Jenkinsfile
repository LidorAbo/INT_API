//@Library('Utilities') _
import groovy.json.JsonSlurper
import hudson.model.*
def BuildVersion
def Current_version
def NextVersion
def dev_rep_docker = 'lidorabo/docker_repo'
def colons = ':'
def module = 'intapi'
def underscore = '_'
 pipeline {

     options {
         timeout(time: 30, unit: 'MINUTES')
     }
     agent { label 'slave' }
     stages {
         stage('Checkout') {
             steps {
                 script {
                     node('master'){
                         dir('Release') {
                             deleteDir()
                             checkout([$class: 'GitSCM', branches: [[name: 'master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'git-cred-id', url: "https://github.com/lidorabo/Release.git"]]])
                             path_json_file = sh(script: "pwd", returnStdout: true).trim() + '/' + 'dev' + '.json'
                             Current_version = Return_Json_From_File("$path_json_file").Services.INT_API

                         }
                     }
                     
                     dir('INT_API') {
                         deleteDir()
                         checkout([$class: 'GitSCM', branches: [[name: 'Dev']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'git-cred-id', url: "https://github.com/lidorabo/INT_API.git"]]])
                         Commit_Id = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                         BuildVersion = Current_version + '_' + Commit_Id
                         last_digit_current_version = sh(script: "echo $Current_version | cut -d'.' -f3", returnStdout: true).trim()
                         NextVersion = sh(script: "echo $Current_version | cut -d. -f1", returnStdout: true).trim() + '.' + sh(script: "echo $Current_version |cut -d'.' -f2", returnStdout: true).trim() + '.' + (Integer.parseInt(last_digit_current_version) + 1)

                     }
                 }
             }
         }
         stage('Build') {
             steps {
                 script {
                     dir('INT_API') {
                         try {
                             sh "sudo docker build . -t $module$colons$BuildVersion"
                             println("The build image is successfully")  

                         }
                         catch (exception) {
                             println "The image build is failed"
                             currentBuild.result = 'FAILURE'
                             throw exception
                         }

                     }
                     
                 }


             }
         }
         stage('Push image to repository'){
             steps{
                 script{
                     try{
                         withCredentials([usernamePassword(credentialsId: 'docker-cred', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                                sh "sudo docker login -u=${DOCKER_USERNAME} -p=${DOCKER_PASSWORD}"
                                sh "sudo docker tag $module$colons$BuildVersion $dev_rep_docker$colons$module$underscore$NextVersion"
                                sh "sudo docker push $dev_rep_docker$colons$module$underscore$NextVersion"
                                
                         }
                         }
                     catch (exception){
                         println "The image pushing to dockehub  failed"
                         currentBuild.result = 'FAILURE'
                         throw exception
                     }
                 }
             }
         }


     }
 }
def Return_Json_From_File(file_name){
    return new JsonSlurper().parse(new File(file_name))
}