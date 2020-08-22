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
        <a class="dropdown-item" href="#" onclick="">Another action</a>
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

function killContainer(id) {
    fetch(`/api/containers/${id}`, {
        method: 'DELETE',
    })
    .then(res => res.json())
    .then(json => {
        console.log(json);
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
            let option = document.createElement('option');
                option.innerHTML = image.RepoTags[0];
            select.appendChild(option);
        }
    });
}

function newContainerModal() {
    $('#newContainerModal').modal();
    loadImagesList();
}