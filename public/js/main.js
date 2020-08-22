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
        <button class="btn btn-danger dropdown-item" href="#">Action</button>
        <button class="btn dropdown-item" href="#">Another action</button>
        <button class="btn dropdown-item" href="#">Something else here</button>
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