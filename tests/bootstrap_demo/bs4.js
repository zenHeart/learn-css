/**
 * Created by lockepc on 2017/5/16.
 */

angular.module("bs4",[]).value('bs4Prop',{
    color:[
        'bg-primary',
        'bg-success',
        'bg-info',
        'bg-warning',
        'bg-danger',
        'bg-inverse',
        'bg-faded'
    ]
});

bs4.directive('bs4-bgcolor',function () {
    function link(scope,elem,attr) {

        // 用来测试利用属性获取框架值
        //console.log(scope[attr.modalTitle]);
        // scope[attr.modalTitle] = 'DFSDF';
        // todo 这个地方的事件后续改为真和假
    }
    return {
        restrict:'E',
        replace:true,
        transclude: false,
        scope: {
            title: '=modalTitle',
            content: '=modalContent',
            btntxt: '=btnTxt',
            display:'='
        },
        templateUrl:'bs4/bgcolor.html',
        link:link,
        controller:function($scope,$rootScope) {
            $scope.closeModal = function(msg) {
                $rootScope.$broadcast('modal',msg);
                $scope.display = 0;
            }
        }
    }
});