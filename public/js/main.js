function addPopup(message, type) {
    let popUpZone = document.getElementById('popUpZone');

    let obj = document.createElement('div');
    obj.className = `alert alert-${type} alert-dismissible fade show`;
    obj.attributes.role = "alert";

    if (type === 'danger')
        obj.innerHTML = `<strong>Oops!</strong> An error occured: ${message}`;
    else if (type === 'success')
        obj.innerHTML = `<strong>Hooray!</strong> ${message}`;
    else
        obj.innerHTML = `${message}`;

    obj.innerHTML += `<button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>`;

    popUpZone.appendChild(obj);
}

// add a popup message depending on the type of json received from the api
function handleJsonMessage(json, onlyBad=false) {
    if (json.error)
        addPopup(json.error, 'danger');
    else if (json.success && !onlyBad)  // sometime we need to handle only the errors
        addPopup(json.success, 'success');
}

function loadContainersList() {
    fetch('/api/containers', {
        method: 'GET',
    })
    .then(res => res.json())
    .then(json => {
        let tbody = document.getElementById('container_list');
        tbody.innerHTML = '';

        for (let container of json) {
            let tr = document.createElement('tr');
                let id = document.createElement('th');
                    id.innerHTML = container.Id.substr(0, 12);
                    id.attributes.scope = "row";
                let name = document.createElement('td');
                    name.innerHTML = container.Names[0];
                let image = document.createElement('td');
                    image.innerHTML = container.Image;
                let cmd = document.createElement('td');
                    cmd.innerHTML = container.Command;
                let state = document.createElement('td');
                    state.innerHTML = container.State;
                let status = document.createElement('td');
                    status.innerHTML = container.Status;
                let action = document.createElement('td');
                    action.innerHTML = `<div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Action
    </button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item bg-danger text-white" href="#" onclick="killContainer('${container.Id}')">Kill</a>
        <a class="dropdown-item" href="#" onclick="getStdout('${container.Name}')">Read stdout</a>
        <a class="dropdown-item" href="#" onclick="">Something else here</a>
    </div>
</div>`;

            tr.appendChild(id);
            tr.appendChild(name);
            tr.appendChild(image);
            tr.appendChild(cmd);
            tr.appendChild(state);
            tr.appendChild(status);
            tr.appendChild(action);

            tbody.appendChild(tr);
        }
    });
}

function createContainer() {
    // gather the form data to send to the api
    let data = {
        containerName: document.getElementById('containerName').value,
        attachStdin: document.getElementById('attachStdin').checked,
        attachStdout: document.getElementById('attachStdout').checked,
        attachStderr: document.getElementById('attachStderr').checked,
        tty: document.getElementById('tty').checked,
        volumes: document.getElementById('volumes').value,
        newContainerSelectImage: document.getElementById('newContainerSelectImage').value,
        containerCommand: document.getElementById('containerCommand').value,
    };

    fetch('/api/containers', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(json => {
        handleJsonMessage(json);

        // close the pop since the job is done or failed, the user needs to see the message
        $('#newContainerModal').modal('hide');
        // reload container list since it changed
        loadContainersList();
    });
}

function getStdout(name) {
    fetch(`/api/containers/${name}/streamo`, {
        method: 'GET',
    })
    .then(res => res.json())
    .then(json => {
        document.getElementById('streamoTitle').innerHTML = `stdout ${name}`;
        document.getElementById('streamoContent').innerHTML = json.data;
        let button = document.createElement('button');
            button.attributes.type = 'button';
            button.className = 'btn btn-primary';
            button.onclick = () => getStdout(name);
            button.innerHTML = 'Refresh';
        document.getElementById('streamoFooter').appendChild(button);
        $('#containersStreamo').modal();
    });
}

function killContainer(id) {
    fetch(`/api/containers/${id}`, {
        method: 'DELETE',
    })
    .then(res => res.json())
    .then(json => {
        handleJsonMessage(json, onlyBad=true);
        // refresh the list since we removed an element
        console.log("refresh")
        loadContainersList();
    });
}

function loadImagesList() {
    fetch('/api/images', {
        method: 'GET',
    })
    .then(res => res.json())
    .then(json => {
        let select = document.getElementById('newContainerSelectImage');
        select.innerHTML = '';

        for (let image of json) {
            // don't add untagged images, they are of no use
            if (image.RepoTags !== null) {
                let option = document.createElement('option');
                    option.innerHTML = image.RepoTags[0];
                select.appendChild(option);
            }
        }
    });
}

function newContainerModal() {
    $('#newContainerModal').modal();
    loadImagesList();
}