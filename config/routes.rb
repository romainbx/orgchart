Orgchartgem::Engine.routes.draw do

  scope :module => 'Orgchartgem' do
    resources :nodes
    resources :charts

    match 'charts/:id' => 'charts#show', :as => :show_chart
    match 'charts/:id' => 'charts#destroy', :as => :destroy_chart
    match 'charts/:id/edit' => 'charts#edit', :as => :edit_chart
    match 'charts/:id/build' => 'charts#build', :as => :build_chart
    match 'charts/:id/deleteFromChart' => 'charts#deleteFromChart'
    match 'charts/:id/nodeOnChart' => 'charts#nodeOnChart'
    match 'charts/:id/loadNode' => 'charts#loadNode'
    match 'charts/:id/loadNodes' => 'charts#loadNodes'
    match 'nodes/:id' => 'nodes#destroy', :as => :destroy_node
  end

end
