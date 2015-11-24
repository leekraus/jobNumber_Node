/**
 * Ajacx-Core
 * Date: 28.09.13
 */

var env_ip = { 'local':'/gettask',
    'remote':'http://www.distributed-computing.herokuapp.com/gettask',
    'resp':'/setresult'};

$(document).ready(function(){

    /** Returns astask template
     * @method getTemlate
     * @param o {Object} data from server with current task
     * */
    var getTemplate = function(o)
    {
        var parsed = JSON.parse(o);
        var number = parsed.ind;
        var result_template = parsed.realization.replace(/{ind}/g,number);
        $("#calculations")[0].text = result_template;

        //TODO apply worker
        var start = performance.now();
        var result = getResult();
        var end = performance.now();

        return {result: result, ind: number, runtime: (end-start)};
    };



    function getNewTasks(){
        $.ajax({
            url: env_ip['local'],
            type:'GET',
            async:true,
            beforeSend: function( xhr ) {
                xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
               // xhr.overrideMimeType();
            }
        })
            .done(function( data ) {

                $.ajax({
                    url: env_ip['resp'],
                    type:'GET',
                    async:true,
                    data : getTemplate(data),
                    beforeSend: function( xhr ) {
                        xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
                        // xhr.overrideMimeType();
                    }
                }).done(function(){
                        getNewTasks();
                    });

            })
            .fail(function() {
                return;
            });
    }
    getNewTasks();
});
