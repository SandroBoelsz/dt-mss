from flask import Blueprint, render_template, request, redirect, url_for

viewpoints_bp = Blueprint('viewpoints', __name__, url_prefix='/viewpoints')

components = [
    {
        'name': 'Simulation Input UI',
        'role': 'Provides the interface to input simulation parameters',
        'interfaces': 'Web application GUI',
        'dependencies': 'Parameter schema, default values'
    },
    {
        'name': 'Simulation Engine',
        'role': 'Processes input parameters and runs simulations',
        'interfaces': 'API endpoints for simulation execution',
        'dependencies': 'Simulation algorithms, computational resources'
    },
    {
        'name': 'Data Storage',
        'role': 'Stores simulation results and metadata',
        'interfaces': 'Database connections, file storage systems',
        'dependencies': 'Database schema, storage capacity'
    },
    {
        'name': 'Visualization Module',
        'role': 'Generates visual representations of simulation results',
        'interfaces': 'Web-based visualization tools, API for data retrieval',
        'dependencies': 'Visualization libraries, data formats'
    }
]


@viewpoints_bp.route('/science')
def science():
    return render_template('viewpoints.html', components=components)


@viewpoints_bp.route('/information')
def information():
    return render_template('viewpoints.html', components=components)


@viewpoints_bp.route('/computational')
def computational():
    return render_template('viewpoints.html', components=components)


@viewpoints_bp.route('/engineering')
def engineering():
    return render_template('viewpoints.html', components=components)


@viewpoints_bp.route('/technology')
def technology():
    return render_template('viewpoints.html', components=components)


@viewpoints_bp.route('/add-component', methods=['POST'])
def add_component():
    name = request.form.get('name')
    role = request.form.get('role')
    interfaces = request.form.get('interfaces')
    dependencies = request.form.get('dependencies')
    if name and role and interfaces and dependencies:
        components.append({
            'name': name,
            'role': role,
            'interfaces': interfaces,
            'dependencies': dependencies
        })
    return redirect(request.referrer)


@viewpoints_bp.route('/delete-component/<int:index>', methods=['POST'])
def delete_component(index):
    if 0 <= index < len(components):
        components.pop(index)
    return redirect(request.referrer)
