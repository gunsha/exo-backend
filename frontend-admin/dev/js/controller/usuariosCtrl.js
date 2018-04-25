angular.module('app').controller('usuariosCtrl', ['$rootScope', 'usuariosService', '$state','$timeout','$filter', usuariosCtrl]);

function usuariosCtrl(r, usuariosService, state, t, f) {
	var vm = this;
	
	vm.new = {};
    vm.list = [];
    vm.orig = [];
    vm.devList = [];
    vm.devOrig = [];
    vm.selected = {};
    vm.tableConfig = {"itemsPerPage":10,"maxPages":5};
    vm.filterText = '';
	
	vm.filtrarTabla = function(){
    	vm.list = f("filter")(vm.orig, vm.filterText);
    }; 

    vm.getAll = function() {
        usuariosService.getAll().then(function(data) {
            vm.list = data;
            vm.orig = data;
            vm.tooltip();
        });
    }

    vm.openModal = function(){
        vm.isEdit = false;
        vm.address = '';
        vm.new = {};
        $('#newUser').modal();
    }
    
    vm.remove = function(item) {
        vm.selected = item;
        swal({
            title: 'Seguro que desea eliminar al usuario?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then(function() {
            usuariosService.remove(vm.selected).then(function() {
                vm.getAll();
                swal({
                    title: 'El usuario ha sido eliminado!',
                    type: 'success',
                    confirmButtonText: 'Aceptar'
                });
            });
        }).catch(swal.noop);
    }
    vm.edit = function(item) {
        vm.isEdit = true;
        vm.new = angular.copy(item);
        vm.new.password = '';
        $('#newUser').modal();
    };
    vm.save = function() {
        var obj = angular.copy(vm.new);
        if (!obj.id) {
            usuariosService.create(obj).then(function() {
                vm.new = {};
                vm.getAll();
                $('#newUser').modal('hide');
            })
        }else{
        	usuariosService.update(obj).then(function() {
                vm.new = {};
                vm.getAll();
                $('.modal').modal('hide');
            })
        }
    }

    vm.getAll();

    appendModal();

    vm.tooltip = function(){
        t(function(){
        $('[data-toggle="tooltip"]').tooltip();
        }, 300);
    }

    $('.modal').on('shown.bs.modal', function (e) {
        vm.tooltip();
    });
}