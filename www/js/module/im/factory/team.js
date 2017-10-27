(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMTeam', ['$rootScope', 'Storage', 'IMMutation', 'IMState', 'IMSearch', 'IMPolyfill',
      function ($rootScope, Storage, IMMutation, IMState, IMSearch, IMPolyfill) {

        return {
          onTeams: onTeams,
          // onupdateteammember: onUpdateTeamMember,
          onTeamMembers: onTeamMembers,
          onSyncTeamMembersDone: onSyncTeamMembersDone,
          // onsynccreateteam: onSyncCreateteam,
          getTeam: getTeam,
          getTeamSession: getTeamSession
        }

        function onTeams(teams) {
          // console.log(teams)
          var nim = IMState.nim
          var teamlist = IMMutation.getTeamlist();
          teamlist = nim.mergeTeams(teamlist, teams);
          teamlist = nim.cutTeams(teamlist, teams.invalid);
          if (!teamlist.length) {
            console.log('无群聊')
            IMMutation.updateLoading(false)
            $rootScope.$emit('hideLoading')
            return
          }
          var newTeamlist = []
          angular.forEach(teamlist, function (data) {
            angular.forEach(IMState.team, function (item) {
              if (data.id == ('team-' + item.teamId)) {
                data.name = item.name
              }
            })
            if(/^team-/.test(data.id)){
              newTeamlist.push(data)
            }
          })
          // console.log(teamlist)
          if(!!newTeamlist.length){
            IMMutation.setTeamList(newTeamlist);
          }else{
            IMMutation.setTeamList(teamlist);
          }
          IMState.hasTeam = true
          Storage.set('hasTeam', IMState.hasTeam)
          if(!IMState.teamlist.length){
            IMState.team = _.without(teams, 'invalid')
          }
          console.log('获取群聊列表', IMState.teamlist)
          IMMutation.addTeamMap(IMState.team)
          IMMutation.updateLoading(false)
          $rootScope.$emit('hideLoading')
        }

        function onTeamMembers(obj) {
          console.log('获取群成员')
          IMMutation.setTeamMembers(obj.teamId, obj.members);
          var members = obj.members;
          for (var i = 0; i < members.length; i++) {
            IMState.teamPerson[members[i].account] = true;
          }
        };

        function onSyncTeamMembersDone() {
          console.log('群成员同步完成');
          IMState.teamMemberDone = true;
          //如果用户消息等拉取完毕，UI开始呈现
          // 未完
        };

        function onSyncCreateteam(data) {
          IMMutation.addTeam(data);
          this.controller.buildTeams();
        };

        function getLocalTeams(teamIds, done) {
          var nim = IMState.nim
          nim.getLocalTeams({
            teamIds: teamIds,
            done: done
          });
        }

        function getTeam(account, done) {
          var nim = IMState.nim
          nim.getTeam({
            teamId: account,
            done: done
          });
        }

        function getTeamSession(){
          var teamSession = IMMutation.mergeTeamSession()
          angular.forEach(teamSession, function(item){ 
            if(!!item.lastMsg&&!!item.lastMsg.attach){ 
              var users = item.lastMsg.attach.users 
              angular.forEach(users, function(data){ 
                if(data.account == item.lastMsg.attach.accounts[0]){ 
                  item.lastMsg.newMember = data.nick 
                } 
              }) 
            } 
          }) 
          return teamSession
        }

        function getTeamMembers(id, callback) {
          var nim = IMState.nim
          nim.getTeamMembers({
            teamId: id,
            done: callback
          });
        }

        function updateTeam(param) {
          var nim = IMState.nim
          nim.updateTeam(param);
        }
        // 群成员静音
        function updateMuteStateInTeam(id, account, mute, callback) {
          var nim = IMState.nim
          nim.updateMuteStateInTeam({
            teamId: id,
            account: account,
            mute: mute,
            done: callback
          });
        }

      }
    ])

})()